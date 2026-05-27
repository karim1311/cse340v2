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

export { getAllProjects }