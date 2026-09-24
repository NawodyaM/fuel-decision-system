import unittest
from unittest.mock import patch
from pydantic import ValidationError
from main import FuelInput, predict, model, expected_features
from train_model import prepare_data

class PredictionTests(unittest.TestCase):
    def setUp(self):
        self.values = dict(IV_Vehicle_Type=1, IV_Fuel_Type=1, IV_Driving_Style=1, IV_Average_Speed=2, IV_Traffic_Type=1, IV_Fuel_Consumption_Rating=1, IV_Quick_Acceleration=0, IV_Sudden_Brakes=0, IV_Traffic_Congestion=1, IV_Stop_and_Go=0, IV_Distance_KM=120)
    def test_model_is_actually_called(self):
        with patch.object(model, 'predict', wraps=model.predict) as spy:
            result = predict(FuelInput(**self.values))
            spy.assert_called_once()
            self.assertEqual(list(spy.call_args.args[0].columns), expected_features)
        self.assertEqual(result['period'], 'weekly')
        self.assertIn('lower_litres', result['fuel_range'])
        self.assertNotIn('prediction', result)
    def test_invalid_inputs(self):
        for key, value in [('IV_Distance_KM', -1), ('IV_Distance_KM', 0), ('IV_Distance_KM', float('inf')), ('IV_Vehicle_Type', 7), ('IV_Traffic_Congestion', 0)]:
            with self.subTest(key=key, value=value), self.assertRaises(ValidationError):
                FuelInput(**dict(self.values, **{key: value}))
    def test_extreme_distance_warns(self):
        result = predict(FuelInput(**dict(self.values, IV_Distance_KM=100000)))
        self.assertTrue(any('outside' in item for item in result['warnings']))
    def test_training_schema_does_not_use_quota_answer(self):
        x, y = prepare_data()
        self.assertNotIn('IV_Quota_Sufficient', x.columns)
        self.assertEqual(set(y), set(range(7)))
        self.assertFalse(x.isna().any().any())

if __name__ == '__main__':
    unittest.main()
