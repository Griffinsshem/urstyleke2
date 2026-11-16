def test_product_list_works_with_and_without_a_trailing_slash(client):
    without = client.get("/api/products")
    with_slash = client.get("/api/products/")
    assert without.status_code == 200
    assert with_slash.status_code == 200
    assert without.get_json() == with_slash.get_json()
