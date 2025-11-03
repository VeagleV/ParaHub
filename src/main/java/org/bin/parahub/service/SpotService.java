package org.bin.parahub.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.bin.parahub.dto.SpotDTO;
import org.bin.parahub.exception.SpotNotFoundException;
import org.bin.parahub.mapper.SpotMapper;
import org.bin.parahub.entity.Spot;
import org.bin.parahub.mapper.TerrainPointMapper;
import org.bin.parahub.repository.SpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final SpotMapper spotMapper;
    private final TerrainPointMapper terrainPointMapper;

    @Autowired
    public SpotService(SpotRepository spotRepository, SpotMapper spotMapper) {
        this.spotRepository = spotRepository;
        this.spotMapper = spotMapper;
        this.terrainPointMapper = new TerrainPointMapper();
    }

    public List<SpotDTO> getAllSpots() {
        return spotRepository.findAll().stream()
                .filter(Spot::getIsEnabled)
                .map(spotMapper::toDTO)
                .toList();
    }

    public SpotDTO getSpotById(long id) {
        Optional<Spot> spot = spotRepository.findById(id);
        if(spot.isPresent() && spot.get().getIsEnabled()) return spotMapper.toDTO(spot.get());
        throw new SpotNotFoundException(id);
    }

    public List<SpotDTO> getSpotByName(String name) {
        List<SpotDTO> spotDTO = spotRepository.findByName(name).stream()
                .filter(Spot::getIsEnabled)
                .map(spotMapper::toDTO)
                .toList();
        if(spotDTO.isEmpty()) throw new SpotNotFoundException(name);
        return spotDTO;
    }

    public List<SpotDTO> getAllSpotsContainingName(String name){
        return spotRepository.findByNameContainingIgnoreCase(name).stream()
                .filter(Spot::getIsEnabled)
                .map(spotMapper::toDTO)
                .toList();
    }

    @Transactional
    public SpotDTO save(SpotDTO spotDTO) {
        Spot spot = spotMapper.toEntity(spotDTO);
        Spot saved = spotRepository.save(spot);
        return spotMapper.toDTO(saved);
    }

    public void deleteSpotById(long id) {
        Spot existingSpot = spotRepository.findById(id).orElseThrow(() -> new SpotNotFoundException(id));
        if(!existingSpot.getIsEnabled()) throw new SpotNotFoundException(id);
        existingSpot.setIsEnabled(false);
        spotRepository.save(existingSpot);
    }


    public SpotDTO updateSpot(long id,SpotDTO spotDTO) {
        Spot existingSpot = spotRepository.findById(id).orElseThrow(() -> new SpotNotFoundException(id));

        existingSpot.setName(spotDTO.getName());
        existingSpot.setIsEnabled(spotDTO.getIsEnabled() != null ? spotDTO.getIsEnabled() : true);
        existingSpot.setLatitude(spotDTO.getLatitude());
        existingSpot.setLongitude(spotDTO.getLongitude());
        existingSpot.setElevation(spotDTO.getElevation());
        existingSpot.setDescription(spotDTO.getDescription());
        existingSpot.setSuitableWinds(spotDTO.getSuitableWinds());
        existingSpot.setXcDifficulty(spotDTO.getXcDifficulty());
        existingSpot.setLearningDifficulty(spotDTO.getLearningDifficulty());
        existingSpot.setAccessibility(spotDTO.getAccessibility());
        existingSpot.setPopularity(spotDTO.getPopularity());
        existingSpot.setBestSeason(spotDTO.getBestSeason());
        existingSpot.setTerrainPoints(terrainPointMapper.toEntityList(spotDTO.getTerrainPoints()));
        Spot saved = spotRepository.save(existingSpot);

        return spotMapper.toDTO(saved);
    }
}
