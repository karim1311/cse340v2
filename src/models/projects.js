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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject }
