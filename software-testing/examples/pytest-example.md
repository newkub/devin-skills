# Pytest Examples

## Basic Test

```python
# test_math.py
import pytest
from math import add, subtract

def test_adds_two_numbers():
    assert add(2, 3) == 5

def test_subtracts_two_numbers():
    assert subtract(5, 3) == 2
```

## Fixtures

```python
# conftest.py
import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user():
    return User(name='John', email='john@example.com')
```

## Parametrization

```python
# test_operations.py
import pytest

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

## Markers

```python
# test_api.py
import pytest

@pytest.mark.slow
def test_heavy_operation():
    # Slow test
    pass

@pytest.mark.integration
def test_database_integration():
    # Integration test
    pass

# Run specific markers
# pytest -m slow
# pytest -m "not slow"
```

## Async Testing

```python
# test_async.py
import pytest

@pytest.mark.asyncio
async def test_async_operation():
    result = await async_function()
    assert result is not None
```

## Mocking

```python
# test_api.py
from unittest.mock import Mock, patch

def test_fetch_user():
    with patch('app.api.get_user') as mock:
        mock.return_value = {'id': 1, 'name': 'John'}
        user = get_user(1)
        assert user['name'] == 'John'
        mock.assert_called_once_with(1)
```

## Coverage

```bash
# Run with coverage
pytest --cov=src --cov-report=html

# Check specific module
pytest --cov=src/module tests/test_module.py
```
