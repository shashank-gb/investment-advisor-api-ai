package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.FundDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FundDetailRepository extends JpaRepository<FundDetail, String> {
}
