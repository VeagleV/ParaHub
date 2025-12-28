package org.bin.parahub.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Аннотация для профилирования методов
 * Автоматически логирует время выполнения, аргументы и результат
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Profiled {
    /**
     * Логировать ли аргументы метода
     */
    boolean logArgs() default true;
    
    /**
     * Логировать ли результат выполнения
     */
    boolean logResult() default false;
    
    /**
     * Порог медленного выполнения в миллисекундах
     */
    long slowThresholdMs() default 100;
}
