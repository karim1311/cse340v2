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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails }
