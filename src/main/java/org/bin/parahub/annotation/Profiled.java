package org.bin.parahub.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation for method profiling
 * Automatically logs execution time, arguments and results
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Profiled {
    /**
     * Whether to log method arguments
     */
    boolean logArgs() default true;
    
    /**
     * Whether to log execution result
     */
    boolean logResult() default false;
    
    /**
     * Slow execution threshold in milliseconds
     */
    long slowThresholdMs() default 100;
}
