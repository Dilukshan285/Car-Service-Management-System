import ServiceType from '../models/ServiceType.js';

// Add new service type
export const createServiceType = async (req, res) => {
  try {
    const { name, description, features, estimatedTime } = req.body;

    // Validate required fields
    if (!name || !estimatedTime) {
      return res.status(400).json({
        success: false,
        message: 'Service name and estimated time are required',
      });
    }

    // Validate estimated time
    const numericEstimatedTime = parseInt(estimatedTime, 10);
    if (isNaN(numericEstimatedTime) || numericEstimatedTime < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estimated time must be a valid positive integer',
      });
    }

    // Validate features (should be an array of strings)
    if (features && !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array of strings',
      });
    }

    const newServiceType = new ServiceType({
      name,
      description: description || '',
      features: features || [],
      estimatedTime: numericEstimatedTime,
    });

    const savedServiceType = await newServiceType.save();

    res.status(201).json({
      success: true,
      message: 'Service type created successfully',
      data: savedServiceType,
    });
  } catch (error) {
    console.error('Error creating service type:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all service types
export const getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    res.status(200).json({
      success: true,
      data: serviceTypes,
    });
  } catch (error) {
    console.error('Error retrieving service types:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single service type by ID
export const getServiceTypeById = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);
    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found',
      });
    }
    res.status(200).json({
      success: true,
      data: serviceType,
    });
  } catch (error) {
    console.error('Error retrieving service type:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a service type
export const updateServiceType = async (req, res) => {
  try {
    const { name, description, features, estimatedTime } = req.body;

    // Validate estimated time if provided
    let numericEstimatedTime;
    if (estimatedTime !== undefined) {
      numericEstimatedTime = parseInt(estimatedTime, 10);
      if (isNaN(numericEstimatedTime) || numericEstimatedTime < 0) {
        return res.status(400).json({
          success: false,
          message: 'Estimated time must be a valid positive integer',
        });
      }
    }

    // Validate features if provided
    if (features && !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array of strings',
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(features && { features }),
      ...(numericEstimatedTime !== undefined && { estimatedTime: numericEstimatedTime }),
    };

    const updatedServiceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedServiceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service type updated successfully',
      data: updatedServiceType,
    });
  } catch (error) {
    console.error('Error updating service type:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a service type
export const deleteServiceType = async (req, res) => {
  try {
    const deletedServiceType = await ServiceType.findByIdAndDelete(req.params.id);
    if (!deletedServiceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service type deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service type:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};