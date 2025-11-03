package org.bin.parahub.repository;

import org.bin.parahub.entity.TerrainPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TerrainPointRepository extends JpaRepository<TerrainPoint, Long> {

    List<TerrainPoint> findBySpotId(Long spotID);

    List<TerrainPoint> findBySpotName(String spotName);

    TerrainPoint findTerrainPointById(Long id);
}
