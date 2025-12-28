package org.bin.parahub.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.bin.parahub.annotation.Profiled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Aspect for profiling methods/classes annotated with @Profiled
 * Logs to console and to logs/profiling.log file
 */
@Aspect
@Component
public class ProfilingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ProfilingAspect.class);
    private static final Logger profilingLogger = LoggerFactory.getLogger("PROFILING");

    /**
     * Профилирование ТОЛЬКО методов/классов с аннотацией @Profiled
     */
    @Around("@annotation(profiled) || (@within(profiled) && execution(* *(..)))")
    public Object profileAnnotatedMethods(ProceedingJoinPoint joinPoint, Profiled profiled) throws Throwable {
        return profileMethod(joinPoint, profiled);
    }

    private Object profileMethod(ProceedingJoinPoint joinPoint, Profiled profiled) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        String fullMethodName = className + "#" + methodName;

        // 1. ОТКУДА ВЫЗВАН (Caller information)
        String caller = getCallerInfo();

        // 2. АРГУМЕНТЫ метода
        Object[] args = joinPoint.getArgs();
        String[] paramNames = signature.getParameterNames();
        String argsStr = formatArguments(args, paramNames);

        // 3. Логируем НАЧАЛО с caller и аргументами
        logBoth(String.format("▶ [%s] CALLED FROM: %s", fullMethodName, caller));
        if (profiled.logArgs() && args.length > 0) {
            logBoth(String.format("  📥 Arguments: %s", argsStr));
        }

        long startTime = System.currentTimeMillis();
        Object result = null;
        Throwable exception = null;

        try {
            result = joinPoint.proceed();
            return result;
        } catch (Throwable e) {
            exception = e;
            throw e;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;

            // 4. Логируем РЕЗУЛЬТАТ
            if (exception != null) {
                logBoth(String.format("✗ [%s] FAILED in %d ms", fullMethodName, executionTime));
                logBoth(String.format("  ❌ Exception: %s - %s", 
                    exception.getClass().getSimpleName(), 
                    exception.getMessage()));
            } else {
                if (executionTime > profiled.slowThresholdMs()) {
                    logBoth(String.format("⚠ SLOW: [%s] took %d ms (threshold: %d ms)", 
                        fullMethodName, executionTime, profiled.slowThresholdMs()));
                } else {
                    logBoth(String.format("✓ [%s] COMPLETED in %d ms", fullMethodName, executionTime));
                }

                // 5. ВОЗВРАЩАЕМОЕ ЗНАЧЕНИЕ
                if (profiled.logResult() && result != null) {
                    String resultStr = formatResult(result);
                    logBoth(String.format("  📤 Result: %s", resultStr));
                }
            }
        }
    }

    /**
     * Получить информацию о том, ОТКУДА вызван метод (caller)
     */
    private String getCallerInfo() {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        
        // Пропускаем первые элементы стека:
        // [0] = getStackTrace
        // [1] = getCallerInfo
        // [2] = profileMethod
        // [3] = profileAnnotatedMethods (AOP proxy method)
        // Начинаем с индекса 4 для поиска реального вызывающего кода
        for (int i = 4; i < stackTrace.length; i++) {
            StackTraceElement element = stackTrace[i];
            String className = element.getClassName();
            
            // Пропускаем Spring и JDK классы
            if (!className.startsWith("org.springframework") 
                && !className.startsWith("java.") 
                && !className.startsWith("jdk.") 
                && !className.contains("$$") // Пропускаем прокси
                && !className.contains("CGLIB")) {
                
                return String.format("%s.%s:%d", 
                    element.getClassName().substring(element.getClassName().lastIndexOf('.') + 1),
                    element.getMethodName(),
                    element.getLineNumber());
            }
        }
        
        return "Unknown";
    }

    /**
     * Форматировать аргументы с именами параметров
     */
    private String formatArguments(Object[] args, String[] paramNames) {
        if (args == null || args.length == 0) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < args.length; i++) {
            if (i > 0) sb.append(", ");
            
            String paramName = (paramNames != null && i < paramNames.length) 
                ? paramNames[i] 
                : "arg" + i;
            
            Object arg = args[i];
            String argValue = formatValue(arg);
            
            sb.append(paramName).append("=").append(argValue);
        }
        sb.append("]");
        
        return sb.toString();
    }

    /**
     * Форматировать результат
     */
    private String formatResult(Object result) {
        return formatValue(result);
    }

    /**
     * Форматировать значение (аргумент или результат)
     * С защитой от циклических ссылок
     */
    private String formatValue(Object value) {
        return formatValue(value, new HashSet<>());
    }

    private String formatValue(Object value, Set<Integer> visited) {
        if (value == null) {
            return "null";
        }

        // Защита от циклических ссылок
        int identityHash = System.identityHashCode(value);
        if (visited.contains(identityHash)) {
            return String.format("%s@%s[CIRCULAR]",
                    value.getClass().getSimpleName(),
                    Integer.toHexString(identityHash));
        }

        // Примитивы и строки
        if (value instanceof String) {
            String str = (String) value;
            if (str.length() > 100) {
                return "\"" + str.substring(0, 97) + "...\"";
            }
            return "\"" + str + "\"";
        }

        if (value instanceof Number || value instanceof Boolean || value instanceof Character) {
            return value.toString();
        }

        // Enum
        if (value instanceof Enum) {
            return value.toString();
        }

        // Коллекции
        if (value instanceof java.util.Collection) {
            java.util.Collection<?> coll = (java.util.Collection<?>) value;
            return String.format("%s[size=%d]", value.getClass().getSimpleName(), coll.size());
        }

        // Map
        if (value instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java. util.Map<?, ?>) value;
            return String.format("%s[size=%d]", value.getClass().getSimpleName(), map.size());
        }

        // Массивы
        if (value. getClass().isArray()) {
            return String.format("%s[length=%d]",
                    value.getClass().getSimpleName(),
                    java.lang.reflect.Array.getLength(value));
        }

        // Entity/DTO объекты - БЕЗ вызова toString()!
        // Только тип + id если есть
        visited.add(identityHash);
        try {
            // Попытка найти getId через рефлексию
            try {
                java.lang.reflect.Method getIdMethod = value.getClass().getMethod("getId");
                Object id = getIdMethod.invoke(value);
                return String.format("%s[id=%s]", value.getClass().getSimpleName(), id);
            } catch (Exception e) {
                // Нет getId - просто тип
                return String.format("%s@%s",
                        value.getClass().getSimpleName(),
                        Integer.toHexString(identityHash));
            }
        } finally {
            visited.remove(identityHash);
        }
    }

    /**
     * Логирование одновременно в консоль и в файл
     */
    private void logBoth(String message) {
        logger.info(message);
        profilingLogger.info(message);
    }
}
