package org.bin.parahub.repository;

import org.bin.parahub.entity.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {

    /**
     * @author VeagleV
     * @param name название старта
     * @return Старт(объект Spot)
     * функция для возвращение старта по ТОЧНОМУ совпадению названия
     */
    Optional<Spot> findByName(String name);

    Optional<Spot> findById(Long id);
    /**
     * @author VeagleV
     * @param name название старта
     * @return список стартов с похожими названиями
     * функция для возвращения стратов с ЧАСТИЧНЫМ совпадением названия
     */
    List<Spot> findByNameContainingIgnoreCase(String name);


}
