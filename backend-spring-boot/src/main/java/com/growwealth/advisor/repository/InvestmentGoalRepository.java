package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.InvestmentGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentGoalRepository extends JpaRepository<InvestmentGoal, String> {
}
