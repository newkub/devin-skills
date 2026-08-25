# Data Flow And Lineage Checks

## Scope

data review สำหรับ: data flow lineage, API input/output schemas, database-to-API mapping, API-to-client mapping, transformation safety, schema consistency across layers, data pipeline, upstream/downstream impact, data caching, data freshness

## Checklist

### Data Flow And Mapping

- ตรวจสอบ data flow: API input → validation → service → database → response, data lineage tracking, data transformation chain
- ตรวจสอบ database-to-API mapping: ORM mapping, serialization, field naming consistency (snake_case vs camelCase), type mapping, null handling in mapping
- ตรวจสอบ API-to-client mapping: response shape, client-side transformation, type safety on client, data contract between API และ client
- ตรวจสอบ transformation safety: type coercion risks, data loss in transformations, null propagation, default value handling, enum mapping, date/timezone conversion
- ตรวจสอบ schema consistency: schema drift across layers, field name inconsistency, type inconsistency, optional/required mismatch

### Data Pipeline And Caching

- ตรวจสอบ data pipeline: data ingestion patterns, ETL safety, data backfill, batch vs streaming, pipeline error handling
- ตรวจสอบ data caching: cache strategy (SWR, TTL, tag-based), cache invalidation, cache key design, cache stampede prevention, stale data risk
- ตรวจสอบ data freshness: polling strategy, WebSocket updates, real-time data sync, stale-while-revalidate, background refresh
- ตรวจสอบ upstream/downstream impact: breaking change propagation, consumer impact analysis, backward compatibility of data shape changes

## Skip Conditions

- ถ้า project ไม่มี data pipeline → ข้ามส่วน data pipeline
- ถ้า project ไม่มี caching → ข้ามส่วน data caching
- ถ้า project ไม่มี real-time data → ข้ามส่วน data freshness

## Severity

- Critical: data loss in transformation, schema mismatch causing runtime error, broken data pipeline, stale data ที่ก่อให้เกิด business error, cache stampede
- High: inconsistent type mapping, missing cache invalidation, missing data contract, broken data lineage, unsafe timezone conversion
- Medium: suboptimal cache strategy, minor schema drift, inconsistent field naming, missing data freshness strategy
- Low: cosmetic, naming convention, documentation gap
