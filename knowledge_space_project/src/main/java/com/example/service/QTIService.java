package com.example.service;

import com.example.model.dto.Question;
import com.example.model.entity.AssessmentTestEntity;
import com.example.model.entity.AssessmentTestQuestionEntity;
import com.example.model.entity.QuestionEntity;
import com.example.model.entity.ResponseEntity;
import com.example.model.exception.NotFoundException;
import com.example.repositories.AssessmentTestEntityRepository;
import jakarta.transaction.Transactional;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class QTIService {

  private final AssessmentTestEntityRepository assessmentTestEntityRepository;
  private static final String IMS_QTI_ROOT = "imsqti";

  public byte[] generateQTI(Integer assessmentTestId) {

    AssessmentTestEntity assessmentTestEntity =
        assessmentTestEntityRepository
            .findById(assessmentTestId)
            .orElseThrow(NotFoundException::new);

    File assessmentTestDir = new File(IMS_QTI_ROOT + "/test-" + assessmentTestId);
    File questionsDir = new File(assessmentTestDir, "questions");
    if(assessmentTestDir.exists()){
      try {
        FileUtils.deleteDirectory(assessmentTestDir);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    if (!questionsDir.mkdirs())
      throw new RuntimeException("An error occurred while creating directories");

    File zip;
      StringBuilder assessmentTestXml =
          new StringBuilder("<?xml version='1.0' encoding='UTF-8'?>"
              + "<qti-assessment-test xmlns=\"http://www.imsglobal.org/xsd/imsqtiasi_v3p0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
              + "xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd\""
              + " identifier=\"test-"
              + assessmentTestId
              + "\" title=\""
              + assessmentTestEntity.getName()
              + "\" >\r\n"
              + "<qti-test-part identifier=\"testPart-1\" "
              + "navigation-mode=\"linear\" " // The "linear" term means that the items within this
              // test part must be responded to in the order listed,
              // and the candidate cannot jump around between items
              // during the assessment session
              + "submission-mode=\"individual\">\r\n"
              + "<qti-assessment-section identifier=\"assessmentSection-1\" title=\"Section 1\" visible=\"true\">\r\n"
              );

      int questionIndex = 1;
      for (QuestionEntity question :
          assessmentTestEntity.getQuestions().stream().map(
              AssessmentTestQuestionEntity::getQuestion).toList()) {

         generateQuestion(assessmentTestEntity, question, questionIndex, questionsDir);
        assessmentTestXml
            .append(" <qti-assessment-item-ref href=\"questions/test")
            .append(assessmentTestEntity.getId())
            .append("-")
            .append(questionIndex).append(".xml\" identifier=\"")
            .append("assessmentTest-")
            .append(assessmentTestId)
            .append("-")
            .append(questionIndex)
            .append("\"/>");
        ++questionIndex;
      }

      assessmentTestXml.append("""
          </qti-assessment-section>
          </qti-test-part>
          </qti-assessment-test>
          """);


    try (BufferedWriter writer = new BufferedWriter(new FileWriter(IMS_QTI_ROOT + "/test-" + assessmentTestId + "/test-" + assessmentTestId + "QTI.xml"))) {

      writer.write(assessmentTestXml.toString());

    } catch (IOException e) {
      e.printStackTrace();
    }

    zipDirectory(assessmentTestDir);

    zip = new File(assessmentTestDir.getName() + ".zip");
    try {
      return convertFileContentToBlob(zip);
    } catch (IOException e) {
      e.printStackTrace();
    }

    return null;
  }


  private void generateQuestion(AssessmentTestEntity assessmentTestEntity,
      QuestionEntity questionEntity, Integer questionIndex, File questionsDir){

ResponseEntity correctAnswer =
    questionEntity.getResponses().stream().filter(ResponseEntity::isCorrect).findFirst().get();
    StringBuilder questionXML =
        new StringBuilder("<?xml version='1.0' encoding='UTF-8'?> "
            + "<qti-assessment-item xmlns=\"http://www.imsglobal.org/xsd/imsqtiasi_v3p0\" "
            + "xmlns:xi=\"http://www.w3.org/2001/XInclude\" xmlns:xsi=\"http://www.w3"
            + ".org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd\" "
            + "adaptive=\"false\" "
            //By not including the adaptive attribute, the item will NOT be considered adaptive (changing to the responses of the candidate)
            + "time-dependent=\"false\" "  //the amount of time a candidate is provided by a
            // delivery system to enter a response is NOT important for the psychometric properties
            + "identifier=\""
            + "assessmentTest-"
            + assessmentTestEntity.getId()
            + "-"
            + questionIndex
            + "\" title=\""
            + "Question "
            + questionIndex
            + "\" >\r\n"
            + "	<qti-response-declaration base-type=\"identifier\" cardinality=\"single\" identifier=\"RESPONSE\">\r\n"
            + "		<qti-correct-response>\r\n"
            + "			<qti-value>" + correctAnswer.getTitle() +"</qti-value>\r\n"
            + "		</qti-correct-response>\r\n"
            + "	</qti-response-declaration>\r\n"
            + "	<qti-outcome-declaration base-type=\"float\" cardinality=\"single\" identifier=\"SCORE\"/>\r\n"
            + "	<qti-item-body>\r\n"
            + "		<qti-choice-interaction max-choices=\"1\" response-identifier=\"RESPONSE\" shuffle=\"true\">"
            + "<qti-prompt>"
            + questionEntity.getTitle()
            + "</qti-prompt>\r\n"
            + "");

    for(ResponseEntity response : questionEntity.getResponses()) {
      questionXML.append("<qti-simple-choice fixed=\"false\" identifier=\"")
          .append(response.getTitle()).append("\">").append(response.getTitle())
          .append("</qti-simple-choice>\r\n");
    }

    questionXML.append("""
        </qti-choice-interaction>
        </qti-item-body>
        <qti-response-processing
        template="https://purl.imsglobal.org/spec/qti/v3p0/rptemplates/match_correct"/>
        </qti-assessment-item>
        """);


    File questionFile =
     new File(questionsDir,
          "test" + assessmentTestEntity.getId().toString() + "-" + questionIndex +
         ".xml");

    try (BufferedWriter writer = new BufferedWriter(new FileWriter(questionFile))) {
      writer.write(questionXML.toString());
    } catch (IOException e) {
      e.printStackTrace();
    }

  }

  private void zipDirectory(File directoryToZip){
    List<File> fileList = new ArrayList<>();
    getAllFiles(directoryToZip, fileList);
    try (FileOutputStream fos = new FileOutputStream(directoryToZip.getName() + ".zip");
        ZipOutputStream zos = new ZipOutputStream(fos)) {

      for (File file : fileList) {
        if (!file.isDirectory()) {
          addToZip(directoryToZip, file, zos);
        }
      }

    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private void getAllFiles(File dir, List<File> fileList){
    File[] files = dir.listFiles();
    for (File file : files) {
      fileList.add(file);
      if (file.isDirectory()) {
        getAllFiles(file, fileList);
      }
    }
  }

  private void addToZip(File directoryToZip, File file, ZipOutputStream zos) throws
      IOException {

    try (FileInputStream fis = new FileInputStream(file)) {

      // we want the zipEntry's path to be a relative path that is relative
      // to the directory being zipped, so chop off the rest of the path
      String zipFilePath = file.getCanonicalPath().substring(directoryToZip.getCanonicalPath().length() + 1,
          file.getCanonicalPath().length());
      ZipEntry zipEntry = new ZipEntry(zipFilePath);
      zos.putNextEntry(zipEntry);

      byte[] bytes = new byte[1024];
      int length;
      while ((length = fis.read(bytes)) >= 0) {
        zos.write(bytes, 0, length);
      }
      zos.closeEntry();

    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public byte[] convertFileContentToBlob(File file) throws IOException {

    byte[] fileContent = new byte[(int) file.length()];
    try (FileInputStream inputStream = new FileInputStream(file)) {
      // create an input stream pointing to the file
      // read the contents of file into byte array
      inputStream.read(fileContent);
    } catch (IOException e) {
      throw new IOException("Unable to convert file to byte array. " +
          e.getMessage());
    }
    // close input stream
    return fileContent;
  }
}


