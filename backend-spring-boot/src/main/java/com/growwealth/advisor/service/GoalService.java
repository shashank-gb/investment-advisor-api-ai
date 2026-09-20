package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.GoalDtos.InvestmentGoalDto;
import com.growwealth.advisor.entity.InvestmentGoal;
import com.growwealth.advisor.repository.InvestmentGoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GoalService {

    private final InvestmentGoalRepository goalRepository;

    public GoalService(InvestmentGoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<InvestmentGoalDto> getAllGoals() {
        return goalRepository.findAll().stream()
                .map(this::mapGoalToDto)
                .collect(Collectors.toList());
    }

    public InvestmentGoalDto mapGoalToDto(InvestmentGoal goal) {
        return InvestmentGoalDto.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .iconData(goal.getIconData())
                .colorHex(goal.getColorHex())
                .categoryIds(new ArrayList<>(goal.getCategoryIds()))
                .build();
    }
}
