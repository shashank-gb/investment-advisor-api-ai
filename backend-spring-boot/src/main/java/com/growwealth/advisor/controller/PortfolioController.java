package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.ApiResponse;
import com.growwealth.advisor.dto.PortfolioDtos.*;
import com.growwealth.advisor.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/portfolio", "/portfolio"})
@Tag(name = "Portfolio (BSE Star MF)", description = "User mutual fund holdings, current value valuation, and XIRR performance metrics")
@SecurityRequirement(name = "BearerAuth")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get portfolio summary", description = "Calculates total invested, current valuation, net returns, percentage gain, and portfolio XIRR")
    public ResponseEntity<PortfolioSummaryDto> getSummary(@AuthenticationPrincipal String userId) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.ok(portfolioService.getPortfolioSummary(uid));
    }

    @GetMapping({"/holdings", ""})
    @Operation(summary = "Get portfolio holdings", description = "Retrieves all active mutual fund holdings, folio numbers, units, and returns")
    public ResponseEntity<List<PortfolioHoldingDto>> getHoldings(@AuthenticationPrincipal String userId) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.ok(portfolioService.getHoldings(uid));
    }

    @PostMapping("/invest")
    @Operation(summary = "Place mutual fund order", description = "Executes an investment order (SIP or Lumpsum) and credits units to the user's portfolio")
    public ResponseEntity<ApiResponse<PortfolioHoldingDto>> invest(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody InvestRequest request) {
        String uid = (userId != null) ? userId : "user_001";
        PortfolioHoldingDto holding = portfolioService.investInFund(uid, request);
        return ResponseEntity.ok(ApiResponse.of(holding, "Investment executed successfully"));
    }
}
