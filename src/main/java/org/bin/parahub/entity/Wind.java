package org.bin.parahub.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.bin.parahub.enums.WindDirection;

@Data
@Entity
@Table(name = "winds")
public class Wind {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WindDirection direction;
    
    @Column(nullable = false)
    private Integer minSpeed; // м/с
    
    @Column(nullable = false)
    private Integer maxSpeed; // м/с
    
    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;
}
