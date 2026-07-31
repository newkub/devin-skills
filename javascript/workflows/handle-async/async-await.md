# Async/Await

## 1. Basic Usage

```javascript
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 2. Sequential Operations

```javascript
async function loadMultiple() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    return { user, posts, comments };
  } catch (error) {
    console.error(error);
  }
}
```

## 3. Parallel Operations

```javascript
async function loadMultipleParallel() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ]);
    return { user, posts, comments };
  } catch (error) {
    console.error(error);
  }
}
```

## 4. Race Conditions

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  try {
    const result = await Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
    return result;
  } catch (error) {
    console.error(error);
  }
}
```
