import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT p.project_id, o.organization_id, o.name organization, p.title, p.description, p.location, p.date
    FROM public.projects p
    LEFT JOIN public.organizations o ON o.organization_id = p.organization_id
    ;
    `

    const result = await db.query(query)

    return result.rows
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
    `

    const queryParams = [organizationId]
    const result = await db.query(query, queryParams)

    return result.rows
}

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
    SELECT p.project_id,
    p.title,
    p.description,
    p.date,
    p.location,
    o.organization_id,
    o.name organization_name
    FROM projects p 
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date 
    LIMIT $1
    `

    const queryParams = [number_of_projects]
    const result = await db.query(query,queryParams)

    return result.rows
}

const getProjectDetails = async (id) => {
    const query = `
    SELECT p.project_id,
    p.title,
    p.description,
    p.date,
    p.location,
    p.organization_id,
    o.name organization_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query, queryParams)

    return result.rows[0]
}

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
    INSERT INTO projects (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id
    `

    const queryParams = [title, description, location, date, organizationId]
    const result = await db.query(query, queryParams)

    if (result.rows.length === 0) {
        throw new Error('Failed to create project')
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id)
    }

    return result.rows[0].project_id
}

const updateProject = async (organizationId, title, description, location, date, projectId) => {
    const query = `
    UPDATE projects 
    SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
    WHERE project_id = $6
    RETURNING project_id
    `

    const queryParams = [organizationId, title, description, location, date, projectId]
    const result = await db.query(query, queryParams)

    if (result.rows.length === 0) {
        throw new Error('Organization not found')
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId)
    }

    return result.rows[0].projectId
}


const getUsersFromProjectId = async (id) => {
    const query = `
    SELECT p.project_id, 
	p.title project_title,
	c.category_id,
	c.name category_name
    FROM users u
    LEFT JOIN project_users pu ON pu.user_id = u.user_id
    LEFT JOIN projects p ON p.project_id = pu.project_id
    WHERE p.project_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query,queryParams)

    return result.rows
}

const getProjectsFromUserId = async (id) => {
    const query = `
    SELECT p.project_id,
	p.title project_title,
    p.date
    FROM projects p 
    LEFT JOIN project_users pu ON p.project_id = pu.project_id
    LEFT JOIN users u ON u.user_id = pu.user_id
	WHERE u.user_id = $1
    `

    const queryParams = [id]
    const result = await db.query(query,queryParams)

    return result.rows
}

const assignUserToProject = async (projectId, userId) => {
    const query = `
        INSERT INTO project_users (project_id, user_id)
        VALUES ($1, $2)
    `

    await db.query(query, [projectId, userId])
}

const removeUserFromProject = async (projectId, userId) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_users
        WHERE project_id = $1 AND user_id = $2
    `

    const queryParams = [projectId, userId]
    await db.query(deleteQuery, queryParams)
}

const isUserVolunteer = async (userId, projectId) => {
    const query = `
    SELECT EXISTS (
        SELECT 1
        FROM project_users
        WHERE user_id = $1 AND
        project_id = $2
    )
    `

    const queryParams = [userId, projectId]
    const result = await db.query(query, queryParams)

    return result.rows[0].exists
}


// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject, getUsersFromProjectId, getProjectsFromUserId, assignUserToProject, removeUserFromProject, isUserVolunteer }
