import { Injectable, LoggerService } from '@nestjs/common';
import { appendFile, stat } from 'fs/promises';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Logger implements LoggerService {
  constructor(
    private readonly configService: ConfigService, // private logFileIndex = 1,
  ) {}
  // private errorLogFileIndex = 1,
  // private warningLogFileIndex = 1,
  // private logFile = process.env.LOG_FILE || 'log',
  // private errorLogFile = process.env.ERROR_LOG_FILE || 'errors',
  // private warningLogFile = process.env.WARNING_LOG_FILE || 'warnings',
  // private logMaxSize = Number(process.env.LOG_MAX_SIZE) || 1024,

  // this.logFileIndex = 1;
  // this.errorLogFileIndex = 1;
  // this.warningLogFileIndex = 1;
  // this.logFile = process.env.LOG_FILE || 'log';
  // this.errorLogFile = process.env.ERROR_LOG_FILE || 'errors';
  // this.warningLogFile = process.env.WARNING_LOG_FILE || 'warnings';
  // this.logMaxSize = Number(process.env.LOG_MAX_SIZE) || 1024;

  logFileIndex: 1;
  errorLogFileIndex: 1;
  warningLogFileIndex: 1;
  logFile: 'log';
  errorLogFile: 'errors';
  warningLogFile: 'warnings';
  logMaxSize: 1024;
  logLevel: 3;

  //log levels: 3 - everything, 2 - logs excluded, 1 - warnings excluded, 0 - nothing (errors excluded)
  async log(message: any) {
    if (Number(this.configService.get('LOG_LEVEL')) < 3) return;
    let pathToLog = resolve(
      process.cwd(),
      `${this.logFile}_${this.logFileIndex}.txt`,
    );
    try {
      const stats = await stat(pathToLog);
      const size = stats.size;
      if (size > this.logMaxSize * 1024) {
        this.logFileIndex++;
        pathToLog = resolve(
          process.cwd(),
          `${this.logFile}_${this.logFileIndex}.txt`,
        );
      }
    } catch (err) {
      //console.log(err);
    }

    console.log(message);
    try {
      await appendFile(pathToLog, `${message}\n`, 'utf-8');
    } catch (err) {
      console.log(err);
    }
  }

  async error(message: any) {
    if (Number(this.configService.get('LOG_LEVEL') < 1)) return;
    let pathToErrorLog = resolve(
      process.cwd(),
      `${this.errorLogFile}_${this.errorLogFileIndex}.txt`,
    );
    try {
      const stats = await stat(pathToErrorLog);
      const size = stats.size;
      if (size > this.logMaxSize * 1024) {
        this.errorLogFileIndex++;
        pathToErrorLog = resolve(
          process.cwd(),
          `${this.errorLogFile}_${this.errorLogFileIndex}.txt`,
        );
      }
    } catch (err) {
      //console.log(err);
    }

    console.log(message);
    try {
      await appendFile(pathToErrorLog, `${message}\n`, 'utf-8');
    } catch (err) {
      console.log(err);
    }
  }

  async warn(message: any) {
    if (Number(this.configService.get('LOG_LEVEL') < 2)) return;
    let pathToWarningLog = resolve(
      process.cwd(),
      `${this.warningLogFile}_${this.warningLogFileIndex}.txt`,
    );
    try {
      const stats = await stat(pathToWarningLog);
      const size = stats.size;
      if (size > this.logMaxSize * 1024) {
        this.warningLogFileIndex++;
        pathToWarningLog = resolve(
          process.cwd(),
          `${this.warningLogFile}_${this.warningLogFileIndex}.txt`,
        );
      }
    } catch (err) {
      // console.log(err);
    }

    console.log(message);
    try {
      await appendFile(pathToWarningLog, `${message}\n`, 'utf-8');
    } catch (err) {
      console.log(err);
    }
  }
}
