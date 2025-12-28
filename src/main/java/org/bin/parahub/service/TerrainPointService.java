package org.bin.parahub.service;


import jakarta.transaction.Transactional;
import org.bin.parahub.annotation.Profiled;
import org.bin.parahub.dto.TerrainPointDTO;
import org.bin.parahub.entity.Spot;
import org.bin.parahub.entity.TerrainPoint;
import org.bin.parahub.exception.SpotNotFoundException;
import org.bin.parahub.exception.TerrainPointNotFoundException;
import org.bin.parahub.mapper.TerrainPointMapper;
import org.bin.parahub.repository.SpotRepository;
import org.bin.parahub.repository.TerrainPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Profiled
public class TerrainPointService {

    private final SpotRepository spotRepository;
    private final TerrainPointRepository terrainPointRepository;
    private final TerrainPointMapper terrainPointMapper;

    @Autowired
    public TerrainPointService(TerrainPointMapper TerrainPointMapper, TerrainPointRepository TerrainPointRepository,  SpotRepository SpotRepository) {
        this.spotRepository = SpotRepository;
        this.terrainPointRepository = TerrainPointRepository;
        this.terrainPointMapper = TerrainPointMapper;
    }

    public List<TerrainPointDTO> getAllTerrainPoints(){
        return terrainPointRepository.findAll().stream()
                .filter(TerrainPoint::getIsEnabled)
                .map(terrainPointMapper::toDTO)
                .toList();
    }

    public List<TerrainPointDTO> getAllTerrainPointsBySpotID(Long spotID){
        return terrainPointRepository.findBySpotId(spotID).stream()
                .filter(TerrainPoint::getIsEnabled)
                .map(terrainPointMapper::toDTO)
                .toList();
    }

    public List<TerrainPointDTO> getAllTerrainPointsBySpotName(String spotName){
        return terrainPointRepository.findBySpotName(spotName).stream()
                .filter(TerrainPoint::getIsEnabled)
                .map(terrainPointMapper::toDTO)
                .toList();
    }

    public TerrainPointDTO getTerrainPointByID(Long id){
        Optional<TerrainPoint> terrainPoint = terrainPointRepository.findById(id);
        if(terrainPoint.isPresent() && terrainPoint.get().getIsEnabled()) return terrainPointMapper.toDTO(terrainPoint.get());
        throw new TerrainPointNotFoundException(id);
    }

    public TerrainPointDTO save(TerrainPointDTO terrainPointDTO){
        TerrainPoint terrainPoint = terrainPointMapper.toEntity(terrainPointDTO);

        if(terrainPointDTO.getSpotId() != null){
            Spot spot = spotRepository.findById(terrainPointDTO.getSpotId())
                    .orElseThrow(() -> new SpotNotFoundException(terrainPointDTO.getSpotId()));
            terrainPoint.setSpot(spot);
        }
        TerrainPoint saved = terrainPointRepository.save(terrainPoint);
        return terrainPointMapper.toDTO(saved);
    }

    public TerrainPointDTO saveWithSpotName(TerrainPointDTO terrainPointDTO, String spotName){
        TerrainPoint terrainPoint = terrainPointMapper.toEntity(terrainPointDTO);

        Spot spot = spotRepository.findByName(spotName)
                        .orElseThrow(()-> new SpotNotFoundException(spotName));
        terrainPoint.setSpot(spot);
        TerrainPoint saved = terrainPointRepository.save(terrainPoint);
        return terrainPointMapper.toDTO(saved);
    }

    public TerrainPointDTO saveWithSpotID(TerrainPointDTO terrainPointDTO, Long spotID){
        TerrainPoint terrainPoint = terrainPointMapper.toEntity(terrainPointDTO);

        Spot spot = spotRepository.findById(spotID)
                        .orElseThrow(()-> new SpotNotFoundException(spotID));
        terrainPoint.setSpot(spot);
        TerrainPoint saved = terrainPointRepository.save(terrainPoint);
        return terrainPointMapper.toDTO(saved);
    }

    public void deleteTerrainPointByID(Long id){
        TerrainPoint existingTerrainPoint = terrainPointRepository.findById(id).orElseThrow(() -> new TerrainPointNotFoundException(id));
        if(!existingTerrainPoint.getIsEnabled()) throw new TerrainPointNotFoundException(id);
        existingTerrainPoint.setIsEnabled(false);
        terrainPointRepository.save(existingTerrainPoint);
    }

    @Transactional
    public void deleteTerrainPointsBySpotID(Long spotID){
        List<TerrainPoint> existingTerrainPoints = terrainPointRepository.findBySpotId(spotID);

        if(existingTerrainPoints.isEmpty()) throw new TerrainPointNotFoundException("there is no  terrain points linked to this spot ");

        existingTerrainPoints.forEach(existingTerrainPoint -> existingTerrainPoint.setIsEnabled(false));

        terrainPointRepository.saveAll(existingTerrainPoints);
    }

}
