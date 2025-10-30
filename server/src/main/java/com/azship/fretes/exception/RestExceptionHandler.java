package com.azship.fretes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;


@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {

        String message = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;


        if (message != null && message.contains("fretes associados")) {

            status = HttpStatus.CONFLICT;
        }

        else if (message != null && message.contains("não encontrada")) {
            status = HttpStatus.NOT_FOUND; // 404
        }


        Map<String, String> errorResponse = Map.of("message", message);


        return new ResponseEntity<>(errorResponse, status);
    }
}