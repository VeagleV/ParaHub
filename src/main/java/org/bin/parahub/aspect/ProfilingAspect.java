package org.bin.parahub.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.bin.parahub.annotation.Profiled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Aspect для автоматического профилирования методов
 * Логирует в консоль и в файл logs/profiling.log
 */
@Aspect
@Component
public class ProfilingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ProfilingAspect.class);
    private static final Logger profilingLogger = LoggerFactory.getLogger("PROFILING");

    /**
     * Профилирование всех методов в @Service классах
     */
    @Around("@within(org.springframework.stereotype.Service)")
    public Object profileServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return profileMethod(joinPoint, true, false, 100);
    }

    /**
     * Профилирование всех методов в @RestController классах
     */
    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object profileControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return profileMethod(joinPoint, true, false, 200);
    }

    /**
     * Профилирование всех методов помеченных @Profiled
     */
    @Around("@annotation(profiled)")
    public Object profileAnnotatedMethods(ProceedingJoinPoint joinPoint, Profiled profiled) throws Throwable {
        return profileMethod(joinPoint, profiled.logArgs(), profiled.logResult(), profiled.slowThresholdMs());
    }

    /**
     * Profiling for mapper methods
     */
    @Around("execution(* org.bin.parahub.mapper..*(..))")
    public Object profileMapperMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return profileMethod(joinPoint, false, false, 50);
    }

    private Object profileMethod(ProceedingJoinPoint joinPoint, boolean logArgs, boolean logResult, long slowThreshold) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        String fullMethodName = className + "#" + methodName;

        // Log method start
        if (logArgs) {
            Object[] args = joinPoint.getArgs();
            String argsStr = args.length > 0 ? Arrays.toString(args) : "[]";
            logBoth(String.format("▶ [%s] START - Args: %s", fullMethodName, argsStr));
        } else {
            logBoth(String.format("▶ [%s] START", fullMethodName));
        }

        long startTime = System.currentTimeMillis();
        Object result = null;
        Throwable exception = null;

        try {
            result = joinPoint.proceed();
        } catch (Throwable e) {
            exception = e;
            throw e;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;

            // Log execution result
            if (exception != null) {
                logBoth(String.format("✗ [%s] FAILED in %d ms - Exception: %s", 
                    fullMethodName, executionTime, exception.getClass().getSimpleName()));
            } else {
                if (executionTime > slowThreshold) {
                    logBoth(String.format("⚠ SLOW METHOD: [%s] took %d ms (threshold: %d ms)", 
                        fullMethodName, executionTime, slowThreshold));
                } else {
                    logBoth(String.format("✓ [%s] COMPLETED in %d ms", fullMethodName, executionTime));
                }

                if (logResult && result != null) {
                    logBoth(String.format("  Result: %s", result.toString()));
                }
            }
        }
        
        return result;
    }

    /**
     * Логирование одновременно в консоль и в файл
     */
    private void logBoth(String message) {
        logger.info(message);
        profilingLogger.info(message);
    }
}
