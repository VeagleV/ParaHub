package org.bin.parahub.mapper;

import org.bin.parahub.dto.TerrainPointDTO;
import org.bin.parahub.entity.TerrainPoint;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TerrainPointMapper {

    public TerrainPoint toEntity(TerrainPointDTO dto){
        TerrainPoint terrainPoint = new TerrainPoint();

        terrainPoint.setId(dto.getId());
        terrainPoint.setIsEnabled(dto.getIsEnabled() != null ? dto.getIsEnabled() : true);
        terrainPoint.setName(dto.getName());
        terrainPoint.setLatitude(dto.getLatitude());
        terrainPoint.setLongitude(dto.getLongitude());
        terrainPoint.setElevation(dto.getElevation());
        terrainPoint.setDescription(dto.getDescription());
        terrainPoint.setType(dto.getType());


        return terrainPoint;
    }

    public TerrainPointDTO toDTO(TerrainPoint entity){
        TerrainPointDTO terrainPointDTO = new TerrainPointDTO();

        terrainPointDTO.setId(entity.getId());
        terrainPointDTO.setIsEnabled(entity.getIsEnabled());
        terrainPointDTO.setName(entity.getName());
        terrainPointDTO.setLatitude(entity.getLatitude());
        terrainPointDTO.setLongitude(entity.getLongitude());
        terrainPointDTO.setElevation(entity.getElevation());
        terrainPointDTO.setDescription(entity.getDescription());
        terrainPointDTO.setType(entity.getType());
        terrainPointDTO.setSpotId(entity.getSpot() != null ? entity.getSpot().getId() : null);

        return terrainPointDTO;
    }

    public List<TerrainPointDTO> toDTOList(List<TerrainPoint> entities){

        List<TerrainPointDTO> terrainPointDTOs = new ArrayList<>();

        for (TerrainPoint entity : entities) {
            terrainPointDTOs.add(toDTO(entity));
        }

        return terrainPointDTOs;
    }

    public List<TerrainPoint> toEntityList(List<TerrainPointDTO> dtos){
        List<TerrainPoint> terrainPoints = new ArrayList<>();

        for (TerrainPointDTO dto : dtos) {
            terrainPoints.add(toEntity(dto));
        }

        return terrainPoints;
    }
}
