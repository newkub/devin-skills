# Branch Strategy

## Definition

Branch strategy คือแนวทางการจัดการ branches เพื่อ:
- จัดระเบียบการพัฒนา
- ลดความขัดแย้ง
- ทำให้ deployment ง่าย
- รักษาความเสถียรของ main branch

## Common Strategies

### 1. Git Flow

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
release/* (release preparation)
hotfix/* (production fixes)
```

**Branches:**
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: New features
- **release/***: Release preparation
- **hotfix/***: Production fixes

**Workflow:**
1. Create feature branch from develop
2. Develop and test
3. Merge to develop
4. Create release branch from develop
5. Test and fix
6. Merge to main and develop
7. Tag release

**Pros:**
- Clear separation
- Structured release process
- Good for large teams

**Cons:**
- Complex
- Many branches
- Overkill for small projects

### 2. GitHub Flow

```
main (production)
  ↑
feature/* (new features)
```

**Branches:**
- **main**: Production-ready code
- **feature/***: New features

**Workflow:**
1. Create feature branch from main
2. Develop and test
3. Create pull request
4. Review and test
5. Merge to main
6. Deploy immediately

**Pros:**
- Simple
- Fast deployment
- Good for continuous deployment

**Cons:**
- Less structured
- May have unstable main
- Not ideal for complex releases

### 3. Trunk-Based Development

```
main (production)
  ↑
short-lived feature branches
```

**Branches:**
- **main**: Production-ready code
- **feature/***: Short-lived branches

**Workflow:**
1. Create short-lived feature branch
2. Develop quickly
3. Merge to main via PR
4. Automated tests and deployment
5. Feature flags for incomplete features

**Pros:**
- Very fast
- Minimal branching
- Continuous integration
- Good for CI/CD

**Cons:**
- Requires strong CI/CD
- Needs feature flags
- Requires discipline

### 4. Release Flow

```
main (production)
  ↑
staging (pre-production)
  ↑
develop (integration)
  ↑
feature/* (new features)
```

**Branches:**
- **main**: Production
- **staging**: Pre-production
- **develop**: Integration
- **feature/***: New features

**Workflow:**
1. Create feature from develop
2. Merge to develop
3. Promote to staging
4. Test on staging
5. Promote to main
6. Deploy to production

**Pros:**
- Clear environments
- Structured promotion
- Good for enterprise

**Cons:**
- More complex
- Slower deployment
- More branches

## Choosing a Strategy

### Small Team / Simple Project
- **GitHub Flow**: Simple and effective

### Medium Team / Regular Releases
- **Git Flow**: Structured and organized

### Large Team / Complex Project
- **Git Flow** or **Release Flow**: More control

### Continuous Deployment
- **Trunk-Based Development**: Fast and automated

### Startup / Fast Pace
- **GitHub Flow**: Quick iterations

## Branch Naming

### Feature Branches
```
feature/description
feature/ticket-description
```

Examples:
```
feature/user-authentication
feature/123-login-form
```

### Bug Fix Branches
```
bugfix/description
fix/description
hotfix/description
```

Examples:
```
bugfix/login-timeout
fix/456-null-pointer
hotfix/security-patch
```

### Release Branches
```
release/version
```

Examples:
```
release/v1.2.0
release/2.0.0
```

## Best Practices

1. **Short-Lived Branches**: Delete branches หลัง merge
2. **Meaningful Names**: ใช้ชื่อที่อธิบายได้
3. **Protected Branches**: Protect main และ develop
4. **Code Review**: ใช้ pull requests
5. **Automated Tests**: Run tests ก่อน merge
6. **Regular Merges**: Merge บ่อยๆ เพื่อลด conflicts
7. **Clean History**: Squash หรือ rebase ตาม strategy
