package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.ApiResponse;
import com.growwealth.advisor.dto.FundDtos.*;
import com.growwealth.advisor.service.FundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/funds", "/funds"})
@Tag(name = "Mutual Funds", description = "Endpoints for exploring categories, top funds, fund details, and searching")
public class FundController {

    private final FundService fundService;

    public FundController(FundService fundService) {
        this.fundService = fundService;
    }

    @GetMapping("/categories")
    @Operation(summary = "List fund categories", description = "Retrieves categories such as Equity, Debt, Hybrid, ELSS, and Index")
    public ResponseEntity<ApiResponse<List<FundCategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.of(fundService.getCategories()));
    }

    @GetMapping("/top-performing")
    @Operation(summary = "Get top performing funds", description = "Retrieves top-performing mutual funds filtered by category")
    public ResponseEntity<ApiResponse<List<MutualFundDto>>> getTopFunds(
            @Parameter(description = "Category ID (e.g. equity, debt, hybrid, elss)")
            @RequestParam(required = false) String category,
            @Parameter(description = "Maximum number of funds to return")
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(ApiResponse.of(fundService.getTopFunds(category, limit)));
    }

    @GetMapping({"/detail", "/detail/{pathId}"})
    @Operation(summary = "Get fund detail", description = "Retrieves full fund metrics including AUM, NAV, expense ratio, exit load, top holdings, and performance history")
    public ResponseEntity<ApiResponse<FundDetailDto>> getFundDetail(
            @PathVariable(value = "pathId", required = false) String pathId,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "fund_id", required = false) String fundId) {
        String targetId = (pathId != null && !pathId.isBlank()) ? pathId : ((id != null && !id.isBlank()) ? id : fundId);
        if (targetId == null || targetId.isBlank()) {
            targetId = "fund_hdfc_top100";
        }
        return ResponseEntity.ok(ApiResponse.of(fundService.getFundDetail(targetId)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search mutual funds", description = "Search funds by name, AMC, or category keyword")
    public ResponseEntity<ApiResponse<List<MutualFundDto>>> searchFunds(
            @Parameter(description = "Search query string")
            @RequestParam String q,
            @Parameter(description = "Maximum results limit")
            @RequestParam(required = false, defaultValue = "20") Integer limit) {
        return ResponseEntity.ok(ApiResponse.of(fundService.searchFunds(q, limit)));
    }

    @GetMapping("/goal-funds")
    @Operation(summary = "Get funds for specific goal", description = "Retrieves recommended mutual funds aligned with an investment goal and risk tolerance")
    public ResponseEntity<ApiResponse<List<MutualFundDto>>> getGoalFunds(
            @Parameter(description = "Goal ID (e.g. house, car, retirement)")
            @RequestParam(value = "goal_id", required = false) String goalId,
            @Parameter(description = "Risk profile: Low, Moderate, High")
            @RequestParam(value = "risk", required = false) String risk) {
        return ResponseEntity.ok(ApiResponse.of(fundService.getGoalFunds(goalId, risk)));
    }
}
