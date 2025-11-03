package org.bin.parahub.mapper;

import org.bin.parahub.dto.SpotDTO;
import org.bin.parahub.entity.Spot;
import org.bin.parahub.entity.TerrainPoint;
import org.springframework.stereotype.Component;

import java.util.ArrayList;


/**
 * @author VeagleV
 * @version 0.1
 * Маппер для сущности Spot, для перевода в DTO и обратно
 * @see Spot
 * @see SpotDTO
 */
@Component
public class SpotMapper {

    private final TerrainPointMapper terrainPointMapper;

    public SpotMapper(TerrainPointMapper terrainPointMapper) {
        this.terrainPointMapper = terrainPointMapper;
    }


    public SpotDTO toDTO(Spot spot){
        SpotDTO spotDTO = new SpotDTO();

        spotDTO.setId(spot.getId());
        spotDTO.setIsEnabled(spot.getIsEnabled());
        spotDTO.setName(spot.getName());
        spotDTO.setLatitude(spot.getLatitude());
        spotDTO.setLongitude(spot.getLongitude());
        spotDTO.setElevation(spot.getElevation());
        spotDTO.setDescription(spot.getDescription());
        spotDTO.setSuitableWinds(spot.getSuitableWinds());
        spotDTO.setXcDifficulty(spot.getXcDifficulty());
        spotDTO.setLearningDifficulty(spot.getLearningDifficulty());
        spotDTO.setAccessibility(spot.getAccessibility());
        spotDTO.setPopularity(spot.getPopularity());
        spotDTO.setBestSeason(spot.getBestSeason());
        spotDTO.setTerrainPoints(terrainPointMapper.toDTOList(spot.getTerrainPoints()));

        return spotDTO;
    }

    /**
     * @author VeagleV
     * @param spotDTO  Объект переноса данных
     * нельзя использовать при изменении существующей записи.
     * Только при создании нового объекта( не появляется в контексте  Hibernate, теряются связи, внутренние поля)
    */
     public Spot toEntity(SpotDTO spotDTO){
        Spot spotEntity = new Spot();

        spotEntity.setIsEnabled(spotDTO.getIsEnabled() != null ? spotDTO.getIsEnabled() : true);
        spotEntity.setName(spotDTO.getName());
        spotEntity.setLatitude(spotDTO.getLatitude());
        spotEntity.setLongitude(spotDTO.getLongitude());
        spotEntity.setElevation(spotDTO.getElevation());
        spotEntity.setDescription(spotDTO.getDescription());
        spotEntity.setSuitableWinds(spotDTO.getSuitableWinds());
        spotEntity.setXcDifficulty(spotDTO.getXcDifficulty());
        spotEntity.setLearningDifficulty(spotDTO.getLearningDifficulty());
        spotEntity.setAccessibility(spotDTO.getAccessibility());
        spotEntity.setPopularity(spotDTO.getPopularity());
        spotEntity.setBestSeason(spotDTO.getBestSeason());
         if (spotDTO.getTerrainPoints() == null) {
             spotEntity.setTerrainPoints(new ArrayList<TerrainPoint>());
         } else {
             spotEntity.setTerrainPoints(terrainPointMapper.toEntityList(spotDTO.getTerrainPoints()));
         }
         return spotEntity;
    }
}
