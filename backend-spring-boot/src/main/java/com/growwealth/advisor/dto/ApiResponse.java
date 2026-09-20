package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private T data;
    private String message;
    private Integer statusCode;

    public static <T> ApiResponse<T> of(T data) {
        return ApiResponse.<T>builder().data(data).statusCode(200).build();
    }

    public static <T> ApiResponse<T> of(T data, String message) {
        return ApiResponse.<T>builder().data(data).message(message).statusCode(200).build();
    }
}
