package org.bin.parahub.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.bin.parahub.enums.PointType;

@Data
@Entity
@Table(name = "terrain_points")
public class TerrainPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean isEnabled = true;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private PointType type;

    @Column(nullable = false)
    private Double latitude;
    @Column(nullable = false)
    private Double longitude;

    private Double elevation;

    @Column(length = 2048)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;


}
