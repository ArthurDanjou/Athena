import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import File from "App/Models/File";
import Translation from "App/Models/Translation";

export default class Announce extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public color: string

  @column()
  public hoverColor: string

  @belongsTo(() => Translation, {
    localKey: 'messageId'
  })
  public message: BelongsTo<typeof Translation>

  @column()
  public messageId: number

  @belongsTo(() => File)
  public cover: BelongsTo<typeof File>

  @column()
  public coverId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
