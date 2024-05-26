import unittest
from unittest.mock import patch, MagicMock
from flask import json
from base64 import b64decode

class FlaskTestCase(unittest.TestCase):
    
    def setUp(self):
        from app import app  
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        # Clean up any resources opened in setUp (if necessary)
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

    def test_patches_route_with_datasource(self):
        response = self.app.get('/patches/cifar100')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('images', data)
        self.assertIn('text', data)
        self.assertEqual(len(data['images']), 2)


    def test_graph_image_route(self):
        response = self.app.get('/get_graph_image')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'image/png')

    def test_graph_json_route(self):
        response = self.app.get('/graph')
        self.assertEqual(response.status_code, 200)
        data = response.get_json() 
        self.assertIn('graph', data)
        self.assertIn('rg', data)
        self.assertIn('layer_weights', data)

    def test_get_training_images_route(self):
        response = self.app.get('/get_training_images')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 2)
        for image_data in data:
            try:
                b64decode(image_data)
                valid_base64 = True
            except Exception:
                valid_base64 = False
            self.assertTrue(valid_base64)



if __name__ == '__main__':
    unittest.main()
