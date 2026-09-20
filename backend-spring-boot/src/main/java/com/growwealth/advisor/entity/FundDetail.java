package com.growwealth.advisor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fund_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundDetail {

    @Id
    @Column(name = "fund_id", length = 64)
    private String fundId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "fund_id")
    private MutualFund fund;

    @Column(nullable = false, length = 50)
    private String aum;

    @Column(name = "expense_ratio", nullable = false, length = 20)
    private String expenseRatio;

    @Column(name = "exit_load", nullable = false, columnDefinition = "TEXT")
    private String exitLoad;

    @Column(name = "min_sip", nullable = false, length = 30)
    private String minSip;
}
