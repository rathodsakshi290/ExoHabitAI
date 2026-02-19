def validate_input(data, required_fields):
    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"
        try:
            float(data[field])
        except:
            return False, f"Invalid value for {field}"
    return True, None
