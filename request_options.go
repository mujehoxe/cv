package main

import (
	"io"
)

type RequestOptions struct {
	Method, URL         string
	Body                io.Reader
	ExpectedStatusCode  int
	ContentType, Accept string
}

type RequestOptionsBuilder struct {
	requestOptions RequestOptions
}

func NewRequestOptionsBuilder(method, url string) *RequestOptionsBuilder {
	return &RequestOptionsBuilder{
		requestOptions: RequestOptions{
			Method:             method,
			URL:                url,
			Body:               nil,
			ExpectedStatusCode: 200,
		},
	}
}

func (b *RequestOptionsBuilder) ContentType(contentType string) *RequestOptionsBuilder {
	b.requestOptions.ContentType = contentType
	return b
}

func (b *RequestOptionsBuilder) Accept(accept string) *RequestOptionsBuilder {
	b.requestOptions.Accept = accept
	return b
}

func (b *RequestOptionsBuilder) Body(body io.Reader) *RequestOptionsBuilder {
	b.requestOptions.Body = body
	return b
}

func (b *RequestOptionsBuilder) ExpectedStatusCode(code int) *RequestOptionsBuilder {
	b.requestOptions.ExpectedStatusCode = code
	return b
}

func (b *RequestOptionsBuilder) Build() RequestOptions {
	return b.requestOptions
}
