package org.bin.parahub.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.bin.parahub.enums.PointType;

import java.util.ArrayList;
import java.util.List;

/**
 * @author VeagleV
 * @version 0.1
 * Класс описывающий парапланерный старт
 */
@Data
@Entity
@Table(name = "Spots")
public class Spot {

    /** id старта. генерируется автоматически*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** определяет активен ли старт(видно его на карте или нет)*/
    @Column(nullable = false)
    private Boolean isEnabled = true;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double elevation;

    private String suitableWinds;

    private Integer xcDifficulty;// (1-5)

    private Integer learningDifficulty;// (1-5)

    private Integer popularity;// (1-5)

    private String bestSeason;

    private String accessibility;

    @Column(length = 2048)
    private String description;

    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TerrainPoint> terrainPoints = new ArrayList<>();


}
