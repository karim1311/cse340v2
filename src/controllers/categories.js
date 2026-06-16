// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsFromCategoryId, getCategoriesFromProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js'
import { getProjectDetails } from '../models/projects.js'
import { body, validationResult } from 'express-validator'

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters')
]



// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories()
    const title = 'Service Categories'

    res.render('categories', { title, categories })
}

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id 
    const categoryDetails = await getCategoryDetails(categoryId)
    const projects = await getProjectsFromCategoryId(categoryId)
    const title = 'Category Details'

    res.render('category', { title, categoryDetails, projects })
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId

    const projectDetails = await getProjectDetails(projectId)
    const categories = await getAllCategories()
    const assignedCategories = await getCategoriesFromProjectId(projectId)

    const title = 'Assign Categories to Project'

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories })
}

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId
    const selectedCategoryIds = req.body.categoryIds || []

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds]
    await updateCategoryAssignments(projectId, categoryIdsArray)
    req.flash('success', 'Categories updated successfully')
    res.redirect(`/project/${projectId}`)
}

const showNewCategoryForm = async (req, res) => {
    const title = 'Add new Category'

    res.render('new-category', { title })
}

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg)
        })
        
        // Redirect back to the new category form
        return res.redirect('/new-category')
    }
    
    
    // Extract form data from req.body
    const { name } = req.body
    
    console.log(name)
    try {
        // Create the new category in the database
        const newCategoryId = await createCategory(name)

        req.flash('success', 'New service category created successfully!')
        res.redirect(`/category/${newCategoryId}`)
    } catch (error) {
        console.error('Error creating the new category:', error)
        req.flash('error', 'There was an error creating the service category.')
        res.redirect('/new-category')
    }
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id
    const categoryDetails = await getCategoryDetails(categoryId)

    const title = 'Edit Category'
    res.render('edit-category', { title, categoryDetails })
}

const processEditCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req)
    if(!results.isEmpty()) {
        // Validation failed - Loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg)
        })

        // Redirect back to the edit category form
        return res.redirect('/edit-category/' + req.params.id)
    }

    const categoryId = req.params.id
    const { name } = req.body

    await updateCategory(categoryId, name)

    // Set a success flash message
    req.flash('success', 'Category updated successfully!')

    res.redirect(`/category/${categoryId}`)
}


// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, categoryValidation, showEditCategoryForm, processEditCategoryForm }