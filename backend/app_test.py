import unittest
from flask import json
from base64 import b64decode

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
        response = self.app.get('/get_image/not_found')
        self.assertEqual(response.status_code, 404)

    def test_patches_route(self):
        response = self.app.get('/patches')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())
        self.assertIn('images', data)
        self.assertIn('text', data)
        images = data['images']
        for img in images:
            img_bytes = b64decode(img)
            self.assertTrue(img_bytes.startswith(b'\x89PNG'))

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
