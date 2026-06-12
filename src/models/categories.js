import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
    FROM public.categories;
    `

    const result = await db.query(query)

    return result.rows
}

const getCategoryDetails = async (id) => {
    const query = `
    SELECT c.category_id,
    c.name category_name
    FROM categories c 
    WHERE c.category_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query,queryParams)
    
    return result.rows[0]
}

const getCategoriesFromProjectId = async (id) => {
    const query = `
    SELECT p.project_id, 
	p.title project_title,
	c.category_id,
	c.name category_name
    FROM categories c
    LEFT JOIN project_categories pc ON pc.category_id = c.category_id
    LEFT JOIN projects p ON p.project_id = pc.project_id
    WHERE p.project_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query,queryParams)

    return result.rows
}

const getProjectsFromCategoryId = async (id) => {
    const query = `
    SELECT c.category_id,
    c.name category_name,
	p.project_id,
	p.title project_title
    FROM projects p 
    LEFT JOIN project_categories pc ON p.project_id = pc.project_id
    LEFT JOIN categories c ON c.category_id = pc.category_id
	WHERE c.category_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query,queryParams)

    return result.rows
}

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2)
    `

    await db.query(query, [categoryId, projectId])
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1
    `
    await db.query(deleteQuery, [projectId])

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId)
    }
}

export { getAllCategories, getCategoryDetails, getCategoriesFromProjectId, getProjectsFromCategoryId, updateCategoryAssignments  }