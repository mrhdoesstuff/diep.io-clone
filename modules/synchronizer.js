function Synchronizer(world)
{
    this.world = world;
    this.pb = dcodeIO.ProtoBuf;
}

Synchronizer.prototype = {
    constructor: Synchronizer,
}

Synchronizer.prototype.registProtocol = function(path)
{
    this.builder = this.pb.loadJsonFile(path);
    this.proto = this.builder.build("Tank");
}

Synchronizer.prototype.syncUnit = function(unit)
{
    var u = new this.proto.Unit();
    u.id = unit.id;
    u.type = unit.type;
    u.cfgName = unit.cfg.alias;
    u.hp = unit.hp;
    u.motion = new this.proto.Motion();
    u.motion.moveDir = new this.proto.Vector(unit.motion.moveDir.x, unit.motion.moveDir.y);
    u.motion.iv = new this.proto.Vector(unit.motion.iv.x, unit.motion.iv.y);
    u.motion.ev = new this.proto.Vector(unit.motion.ev.x, unit.motion.ev.y);
    u.motion.rv = unit.motion.rv;
    u.motion.position = new this.proto.Vector(unit.x, unit.y);
    u.motion.rotation = unit.rotation;

    var pkg = new this.proto.Pkg();
    pkg.head = new this.proto.Head();
    pkg.head.frame = this.world.frame;
    pkg.head.cmd = this.proto.SyncCmd.SYNC_UNITS;
    pkg.body = new this.proto.Body();
    pkg.body.syncUnits = new this.proto.SyncUnits();
    pkg.body.syncUnits.units = [];
    pkg.body.syncUnits.units.push(u);

    var buffer = pkg.encode();
    console.log(buffer.toArrayBuffer());
    // TODO: send
}

module.exports = Synchronizer;
