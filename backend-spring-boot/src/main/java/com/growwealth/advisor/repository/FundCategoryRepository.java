package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.FundCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundCategoryRepository extends JpaRepository<FundCategory, String> {
    List<FundCategory> findAllByOrderByDisplayOrderAsc();
}
