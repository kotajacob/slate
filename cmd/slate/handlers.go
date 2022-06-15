package main

import (
	"fmt"
	"net/http"
)

func (s *slate) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	ts, ok := s.templateCache["home.tmpl"]
	if !ok {
		err := fmt.Errorf("the template %s does not exist", "home.tmpl")
		s.errLog.Println(err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusOK)

	err := ts.ExecuteTemplate(w, "base", nil)
	if err != nil {
		s.errLog.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
