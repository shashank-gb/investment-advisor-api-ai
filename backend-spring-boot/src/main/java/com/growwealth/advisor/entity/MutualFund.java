package com.growwealth.advisor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mutual_funds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MutualFund {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 150)
    private String amc;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category", referencedColumnName = "id", insertable = false, updatable = false)
    private FundCategory fundCategory;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal nav;

    @Column(name = "returns_1y", nullable = false, precision = 6, scale = 2)
    private BigDecimal returns1Y;

    @Column(name = "returns_3y", precision = 6, scale = 2)
    private BigDecimal returns3Y;

    @Column(name = "risk_level", nullable = false, length = 50)
    private String riskLevel;

    @Column(name = "min_investment", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minInvestment = BigDecimal.valueOf(500.0);

    @OneToOne(mappedBy = "fund", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private FundDetail detail;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FundHolding> holdings = new ArrayList<>();

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FundNavHistory> navHistory = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
