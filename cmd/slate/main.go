package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"text/template"
)

type slate struct {
	errLog        *log.Logger
	infoLog       *log.Logger
	templateCache map[string]template.Template
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO ", log.Ldate|log.Ltime)
	errLog := log.New(os.Stderr, "ERROR ", log.Ldate|log.Ltime|log.Lshortfile)

	templateCache, err := newTemplateCache()
	if err != nil {
		errLog.Fatal(err)
	}

	s := &slate{
		errLog:        errLog,
		infoLog:       infoLog,
		templateCache: templateCache,
	}

	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("./ui/static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	mux.HandleFunc("/", s.home)

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errLog,
		Handler:  mux,
	}

	infoLog.Printf("Starting server on %s", *addr)
	err = srv.ListenAndServe()
	errLog.Fatal(err)
}
