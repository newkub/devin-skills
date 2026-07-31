# Promises

## 1. Create Promise

```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: 'John' };
      resolve(data);
    }, 1000);
  });
};
```

## 2. Consume Promise

```javascript
fetchData()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

## 3. Promise Chaining

```javascript
fetchData()
  .then(data => {
    return processData(data);
  })
  .then(processedData => {
    return saveData(processedData);
  })
  .then(savedData => {
    console.log('Saved:', savedData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
