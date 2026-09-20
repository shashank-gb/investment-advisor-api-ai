package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.ApiResponse;
import com.growwealth.advisor.dto.WatchlistDtos.*;
import com.growwealth.advisor.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/watchlist", "/watchlist"})
@Tag(name = "Watchlists", description = "User custom watchlist groups and tracked mutual funds")
@SecurityRequirement(name = "BearerAuth")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping("/groups")
    @Operation(summary = "Get user watchlist groups", description = "Retrieves all custom watchlist folders (e.g. My Picks, Retirement)")
    public ResponseEntity<ApiResponse<List<WatchlistGroupDto>>> getGroups(@AuthenticationPrincipal String userId) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.ok(ApiResponse.of(watchlistService.getGroups(uid)));
    }

    @PostMapping("/groups")
    @Operation(summary = "Create a watchlist group", description = "Creates a new named watchlist container")
    public ResponseEntity<ApiResponse<WatchlistGroupDto>> createGroup(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateWatchlistGroupRequest request) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(watchlistService.createGroup(uid, request)));
    }

    @GetMapping("/funds")
    @Operation(summary = "Get funds in watchlist", description = "Retrieves mutual funds saved in a specific watchlist folder")
    public ResponseEntity<ApiResponse<List<WatchlistFundDto>>> getFundsForGroup(
            @AuthenticationPrincipal String userId,
            @Parameter(description = "Watchlist Group ID")
            @RequestParam(value = "group_id", required = false) String groupId) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.ok(ApiResponse.of(watchlistService.getFundsForGroup(uid, groupId)));
    }

    @PostMapping("/funds")
    @Operation(summary = "Add fund to watchlist", description = "Saves a mutual fund into a specific watchlist group")
    public ResponseEntity<ApiResponse<WatchlistFundDto>> addFund(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AddWatchlistFundRequest request) {
        String uid = (userId != null) ? userId : "user_001";
        return ResponseEntity.ok(ApiResponse.of(watchlistService.addFundToGroup(uid, request)));
    }

    @DeleteMapping("/funds")
    @Operation(summary = "Remove fund from watchlist", description = "Deletes a mutual fund from a watchlist group")
    public ResponseEntity<Map<String, String>> removeFund(
            @AuthenticationPrincipal String userId,
            @RequestParam("group_id") String groupId,
            @RequestParam("fund_id") String fundId) {
        String uid = (userId != null) ? userId : "user_001";
        watchlistService.removeFundFromGroup(uid, groupId, fundId);
        return ResponseEntity.ok(Map.of("message", "Fund removed from watchlist successfully"));
    }
}
