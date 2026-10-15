# Vercel cli

## follow-service-vercel-cli (merged content)

### Goal

Use the Vercel CLI to deploy, manage, and monitor projects on the Vercel platform

### Scope

Used for projects deployed to Vercel, including Next.js, Nuxt, React, and other frameworks

### Execute

#### 1. Install And Authenticate

> Goal: Install And Authenticate

Install and set up the Vercel CLI

1. Install the Vercel CLI with `bun add -g vercel` or `bun add -g vercel`
2. Check the version with `vercel --version`
3. Log in with `vercel login` to connect to the Vercel account
4. Pick the team and scope you want
5. Verify authentication with `vercel whoami`

#### 2. Initialize Project

> Goal: Initialize Project

Create and link the project with Vercel

1. Link an existing project with `vercel link`
2. Create a new project with `vercel`
3. Set the project name and settings
4. Pick a framework preset or custom build settings
5. Create a `vercel.json` config file when needed

#### 3. Local Development

> Goal: Local Development

Develop and test in the local environment

1. Run the local dev server with `vercel dev`
2. Check logs and errors in the terminal
3. Use the `--listen` flag for a custom port
4. Test environment variables and build settings
5. Simulate the production environment locally

#### 4. Deploy To Preview

> Goal: Deploy To Preview

Deploy to preview environments

1. Deploy with `vercel` to create a preview deployment
2. Check the deployment URL and status
3. View logs with `vercel logs`
4. Test the preview deployment before merge
5. Share the preview URL for code review

#### 5. Deploy To Production

> Goal: Deploy To Production

Deploy to the production environment

1. Deploy to production with `vercel --prod`
2. Use the `--prebuilt` flag for prebuilt deployments
3. Check the production deployment status
4. Monitor production logs with `vercel logs --prod`
5. Roll back when needed with `vercel rollback`

#### 6. Manage Environment Variables

> Goal: Manage Environment Variables

Manage environment variables and secrets

1. Set an environment variable with `vercel env add`
2. List environment variables with `vercel env ls`
3. Pull environment variables with `vercel env pull`
4. Use environment-specific variables with `--environment`
5. Never commit secrets to git

#### 7. Monitor And Debug

> Goal: Monitor And Debug

Monitor and debug deployments

1. View logs with `vercel logs`
2. Filter logs with the `--level` flag
3. Monitor a specific deployment with `--deployment`
4. Inspect build output with `vercel inspect`
5. View deployment metrics with `vercel metrics`

#### 8. Manage Domains

> Goal: Manage Domains

Manage custom domains

1. Add a custom domain with `vercel domains add`
2. List domains with `vercel domains ls`
3. Remove a domain with `vercel domains rm`
4. Verify DNS configuration
5. SSL certificates are configured automatically

#### 9. Team And Project Management

> Goal: Team And Project Management

Manage teams and projects

1. List projects with `vercel list`
2. Switch teams with `vercel switch`
3. Manage team members via the dashboard
4. Configure project settings
5. Manage billing and usage

### Rules

#### 1. Configuration Management

Manage configuration files systematically

- Use `vercel.json` for custom build settings
- Set `buildCommand` and `outputDirectory` correctly
- Use environment-specific configs with `--environment`
- Never hardcode secrets in config files
- Use `.env` files for local development
- Use the Vercel dashboard for sensitive configs

#### 2. Deployment Best Practices

Follow deployment best practices

- Always deploy to preview before production
- Use Git integration for automatic deployments
- Test preview deployments before merging a PR
- Use `--prebuilt` for faster deployments
- Monitor logs after every deploy
- Set deployment protection for production

#### 3. Environment Variable Security

Keep environment variables secure

- Never commit secrets to version control
- Use `/follow-secret-manager` to manage `VERCEL_TOKEN` and secrets instead of plain `.env`
- Use `vercel env add` instead of editing config files
- Use environment-specific variables for isolation
- Rotate secrets regularly
- Check variable access logs
- Use different environments for dev/staging/prod

#### 4. Development Workflow

Use an efficient development workflow

- Use `vercel dev` for local development
- Simulate the production environment locally
- Test environment variables locally
- Monitor logs and errors in real time
- Use Git integration for automatic preview deployments
- Use branch-based deployments for feature branches

#### 5. Performance Optimization

Improve deployment performance

- Use the `--prebuilt` flag for faster builds
- Optimize the build process with caching
- Use edge functions for dynamic content
- Monitor build times and deployment duration
- Use image optimization for assets
- Check bundle size and loading performance

#### 6. CI/CD Integration

Integrate the Vercel CLI with CI/CD pipelines

- Use `VERCEL_TOKEN` for authentication
- Use `vercel --prod --token` in CI
- Set environment variables in CI/CD
- Use `vercel env pull` for local development
- Test before deploy with `vercel dev`
- Use GitHub Actions or GitLab CI for automation

#### 7. Monitoring And Debugging

Monitor and debug deployments effectively

- Use `vercel logs` for real-time monitoring
- Filter logs with `--level error` for errors
- Monitor a specific deployment with `--deployment`
- Use `vercel inspect` for build debugging
- Check deployment metrics and analytics
- Use the Vercel dashboard for detailed insights

- Use /open-web-for-config-secret if needed
- Use /follow-service-vercel if needed

### Expected Outcome

- Vercel CLI installed and configured correctly
- Projects deploy smoothly
- Environment variables managed securely
- Development workflow is efficient
- CI/CD integration works automatically
- Monitoring and debugging are effective
