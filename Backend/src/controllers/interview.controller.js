const pdfParse = require("pdf-parse");

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");


/**
 * @description Controller to generate interview report based on
 * user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {

        // Check if resume file is uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required."
            });
        }

        // Check file type
        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF files are allowed."
            });
        }

        // Parse PDF
        const pdfData = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText();

        const { selfDescription, jobDescription } = req.body;

        // Check required fields
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Self description and job description are required."
            });
        }

        // Generate interview report using AI
        const interViewReportByAi = await generateInterviewReport({
            resume: pdfData.text,
            selfDescription,
            jobDescription
        });

        // Save interview report in database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: pdfData.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {

        console.error(
            "Generate Interview Report Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        });
    }
}


/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {

        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });

    } catch (error) {

        console.error(
            "Get Interview Report Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: error.message
        });
    }
}


/**
 * @description Controller to get all interview reports
 * of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {

        const interviewReports = await interviewReportModel
            .find({
                user: req.user.id
            })
            .sort({
                createdAt: -1
            })
            .select(
                "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
            );

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });

    } catch (error) {

        console.error(
            "Get All Interview Reports Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: error.message
        });
    }
}


/**
 * @description Controller to generate resume PDF
 * based on interview report.
 */
async function generateResumePdfController(req, res) {
    try {

        const { interviewReportId } = req.params;

        const interviewReport =
            await interviewReportModel.findById(
                interviewReportId
            );

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {

        console.error(
            "Generate Resume PDF Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: error.message
        });
    }
}


module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};