import unittest
from flask import json

class FlaskTestCase(unittest.TestCase):
    
    def setUp(self):
        from app import app  
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_start_page_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), 'Vision Transformer Model API')

    def test_get_image_route(self):
        response = self.app.get('/get_image/dense_1_bias_11')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'image/png')

    def test_patches_route(self):
        response = self.app.get('/patches')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('images', data)
        self.assertIn('text', data)

    def test_graph_image_route(self):
        response = self.app.get('/get_graph_image')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'image/png')

    def test_graph_json_route(self):
        response = self.app.get('/graph')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('graph', data)
        self.assertIn('rg', data)
        self.assertIn('layer_weights', data)


if __name__ == '__main__':
    unittest.main()
