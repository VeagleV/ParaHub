package org.bin.parahub.mapper;

import org.bin.parahub.dto.WindDTO;
import org.bin.parahub.entity.Wind;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class WindMapper {
    
    public Wind toEntity(WindDTO dto) {
        Wind wind = new Wind();
        wind.setId(dto.getId());
        wind.setDirection(dto.getDirection());
        wind.setMinSpeed(dto.getMinSpeed());
        wind.setMaxSpeed(dto.getMaxSpeed());
        return wind;
    }
    
    public WindDTO toDTO(Wind entity) {
        WindDTO dto = new WindDTO();
        dto.setId(entity.getId());
        dto.setDirection(entity.getDirection());
        dto.setMinSpeed(entity.getMinSpeed());
        dto.setMaxSpeed(entity.getMaxSpeed());
        dto.setSpotId(entity.getSpot() != null ? entity.getSpot().getId() : null);
        return dto;
    }
    
    public List<WindDTO> toDTOList(List<Wind> entities) {
        List<WindDTO> dtos = new ArrayList<>();
        for (Wind entity : entities) {
            dtos.add(toDTO(entity));
        }
        return dtos;
    }
    
    public List<Wind> toEntityList(List<WindDTO> dtos) {
        List<Wind> entities = new ArrayList<>();
        for (WindDTO dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }
}
