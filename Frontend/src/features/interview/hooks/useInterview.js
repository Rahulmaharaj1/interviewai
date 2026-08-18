import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context


    // Generate Interview Report
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true)

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            if (!response || !response.interviewReport) {
                console.error("Invalid response from server:", response)
                return null
            }

            setReport(response.interviewReport)

            return response.interviewReport

        } catch (error) {

            console.error(
                "Generate Interview Report Error:",
                error.response?.data || error.message
            )

            return null

        } finally {

            setLoading(false)

        }
    }


    // Get Interview Report By ID
    const getReportById = async (id) => {

        setLoading(true)

        try {

            const response = await getInterviewReportById(id)

            if (!response || !response.interviewReport) {
                console.error("Invalid interview report response:", response)
                return null
            }

            setReport(response.interviewReport)

            return response.interviewReport

        } catch (error) {

            console.error(
                "Get Interview Report Error:",
                error.response?.data || error.message
            )

            return null

        } finally {

            setLoading(false)

        }
    }


    // Get All Interview Reports
    const getReports = async () => {

        setLoading(true)

        try {

            const response = await getAllInterviewReports()

            if (!response || !response.interviewReports) {
                console.error("Invalid interview reports response:", response)
                setReports([])
                return []
            }

            setReports(response.interviewReports)

            return response.interviewReports

        } catch (error) {

            console.error(
                "Get Interview Reports Error:",
                error.response?.data || error.message
            )

            setReports([])

            return []

        } finally {

            setLoading(false)

        }
    }


    // Generate Resume PDF
    const getResumePdf = async (interviewReportId) => {

        setLoading(true)

        try {

            const response = await generateResumePdf({
                interviewReportId
            })

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: "application/pdf"
                })
            )

            const link = document.createElement("a")

            link.href = url

            link.setAttribute(
                "download",
                `resume_${interviewReportId}.pdf`
            )

            document.body.appendChild(link)

            link.click()

            link.remove()

            window.URL.revokeObjectURL(url)

        } catch (error) {

            console.error(
                "Generate Resume PDF Error:",
                error.response?.data || error.message
            )

        } finally {

            setLoading(false)

        }
    }


    // Load reports when page loads
    useEffect(() => {

        if (interviewId) {

            getReportById(interviewId)

        } else {

            getReports()

        }

    }, [interviewId])


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}