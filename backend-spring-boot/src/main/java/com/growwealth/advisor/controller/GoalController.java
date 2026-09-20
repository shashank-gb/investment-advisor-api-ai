package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.ApiResponse;
import com.growwealth.advisor.dto.FundDtos.MutualFundDto;
import com.growwealth.advisor.dto.GoalDtos.InvestmentGoalDto;
import com.growwealth.advisor.service.FundService;
import com.growwealth.advisor.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/goals", "/goals"})
@Tag(name = "Investment Goals", description = "Endpoints for goal-based investment planning (House, Car, Retirement, etc.)")
public class GoalController {

    private final GoalService goalService;
    private final FundService fundService;

    public GoalController(GoalService goalService, FundService fundService) {
        this.goalService = goalService;
        this.fundService = fundService;
    }

    @GetMapping("/list")
    @Operation(summary = "List investment goals", description = "Retrieves predefined milestone goals with visual icons, colors, and category mappings")
    public ResponseEntity<ApiResponse<List<InvestmentGoalDto>>> getGoals() {
        return ResponseEntity.ok(ApiResponse.of(goalService.getAllGoals()));
    }

    @GetMapping("/funds")
    @Operation(summary = "Get funds for goal", description = "Retrieves recommended mutual funds aligned with the specified goal and risk profile")
    public ResponseEntity<ApiResponse<List<MutualFundDto>>> getGoalFunds(
            @Parameter(description = "Goal ID (e.g. house, car, retirement)")
            @RequestParam("goal_id") String goalId,
            @Parameter(description = "Risk appetite: Low, Moderate, High")
            @RequestParam(value = "risk", required = false) String risk) {
        return ResponseEntity.ok(ApiResponse.of(fundService.getGoalFunds(goalId, risk)));
    }
}
